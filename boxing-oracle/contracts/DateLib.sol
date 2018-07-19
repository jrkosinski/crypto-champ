pragma solidity ^0.4.16;

library DateLib {
    struct DateTime {
        uint16 year;
        uint8 month;
        uint8 day;
        uint8 hour;
        uint8 minute;
        uint8 second;
        uint8 ms;
        uint8 weekday;
    }

    uint constant DAY_IN_SECONDS = 86400;
    uint constant YEAR_IN_SECONDS = 31536000;
    uint constant LEAP_YEAR_IN_SECONDS = 31622400;

    uint constant HOUR_IN_SECONDS = 3600;
    uint constant MINUTE_IN_SECONDS = 60;

    uint16 constant ORIGIN_YEAR = 1970;


    function _getYear(uint _timestamp) private pure returns (uint16) {
        uint secondsAccountedFor = 0;
        uint16 year;
        uint numLeapYears;

        // Year
        year = uint16(ORIGIN_YEAR + _timestamp / YEAR_IN_SECONDS);
        numLeapYears = leapYearsBefore(year) - leapYearsBefore(ORIGIN_YEAR);

        secondsAccountedFor += LEAP_YEAR_IN_SECONDS * numLeapYears;
        secondsAccountedFor += YEAR_IN_SECONDS * (year - ORIGIN_YEAR - numLeapYears);

        while (secondsAccountedFor > _timestamp) {
            if (isLeapYear(uint16(year - 1))) {
                secondsAccountedFor -= LEAP_YEAR_IN_SECONDS;
            }
            else {
                secondsAccountedFor -= YEAR_IN_SECONDS;
            }
            year -= 1;
        }
        return year;
    }

    function _getMonth(uint _timestamp) private pure returns (uint8) {
        return fromTimestamp(_timestamp).month;
    }

    function _getDay(uint _timestamp) private pure returns (uint8) {
        return fromTimestamp(_timestamp).day;
    }

    function _getHour(uint _timestamp) private pure returns (uint8) {
        return uint8((_timestamp / 60 / 60) % 24);
    }

    function _getMinute(uint _timestamp) private pure returns (uint8) {
        return uint8((_timestamp / 60) % 60);
    }

    function _getSecond(uint _timestamp) private pure returns (uint8) {
        return uint8(_timestamp % 60);
    }


    function getWeekday(uint _timestamp) internal pure returns (uint8) {
        return uint8((_timestamp / DAY_IN_SECONDS + 4) % 7);
    }

    function isLeapYear(uint16 _year) internal pure returns (bool) {
        if (_year % 4 != 0) {
            return false;
        }
        if (_year % 100 != 0) {
            return true;
        }
        if (_year % 400 != 0) {
            return false;
        }
        return true;
    }

    function leapYearsBefore(uint _year) internal pure returns (uint) {
        uint year = _year - 1;
        return year / 4 - year / 100 + year / 400;
    }

    function getDaysInMonth(uint8 _month, uint16 _year) internal pure returns (uint8) {
        if (_month == 1 || _month == 3 || _month == 5 || _month == 7 || _month == 8 || _month == 10 || _month == 12) {
            return 31;
        }
        else if (_month == 4 || _month == 6 || _month == 9 || _month == 11) {
            return 30;
        }
        else if (isLeapYear(_year)) {
            return 29;
        }
        else {
            return 28;
        }
    }

    function fromTimestamp(uint _timestamp) internal pure returns (DateTime) { 
        return fromUnixTimestamp(_timestamp/1000);
    }

    function fromUnixTimestamp(uint _timestamp) internal pure returns (DateTime dt) {
        uint secondsAccountedFor = 0;
        uint buf;
        uint8 i;

        // Year
        dt.year = _getYear(_timestamp);
        buf = leapYearsBefore(dt.year) - leapYearsBefore(ORIGIN_YEAR);

        secondsAccountedFor += LEAP_YEAR_IN_SECONDS * buf;
        secondsAccountedFor += YEAR_IN_SECONDS * (dt.year - ORIGIN_YEAR - buf);

        // Month
        uint secondsInMonth;
        for (i = 1; i <= 12; i++) {
            secondsInMonth = DAY_IN_SECONDS * getDaysInMonth(i, dt.year);
            if (secondsInMonth + secondsAccountedFor > _timestamp) {
                dt.month = i;
                break;
            }
            secondsAccountedFor += secondsInMonth;
        }

        // Day
        for (i = 1; i <= getDaysInMonth(dt.month, dt.year); i++) {
            if (DAY_IN_SECONDS + secondsAccountedFor > _timestamp) {
                dt.day = i;
                break;
            }
            secondsAccountedFor += DAY_IN_SECONDS;
        }

        // Hour
        dt.hour = _getHour(_timestamp);

        // Minute
        dt.minute = _getMinute(_timestamp);

        // Second
        dt.second = _getSecond(_timestamp);

        // Day of week.
        dt.weekday = getWeekday(_timestamp);
    }

    function toTimestamp(DateTime _date) internal pure returns (uint timestamp) {
        uint output = toUnixTimestamp(_date); 
        return output * 1000 + _date.ms;
    }

    function toUnixTimestamp(DateTime _date) internal pure returns (uint timestamp) {
        uint16 i;

        // Year
        for (i = ORIGIN_YEAR; i < _date.year; i++) {
            if (isLeapYear(i)) {
                timestamp += LEAP_YEAR_IN_SECONDS;
            }
            else {
                timestamp += YEAR_IN_SECONDS;
            }
        }

        // Month
        uint8[12] memory monthDayCounts;
        monthDayCounts[0] = 31;
        if (isLeapYear(_date.year)) {
            monthDayCounts[1] = 29;
        }
        else {
            monthDayCounts[1] = 28;
        }
        monthDayCounts[2] = 31;
        monthDayCounts[3] = 30;
        monthDayCounts[4] = 31;
        monthDayCounts[5] = 30;
        monthDayCounts[6] = 31;
        monthDayCounts[7] = 31;
        monthDayCounts[8] = 30;
        monthDayCounts[9] = 31;
        monthDayCounts[10] = 30;
        monthDayCounts[11] = 31;

        for (i = 1; i < _date.month; i++) {
            timestamp += DAY_IN_SECONDS * monthDayCounts[i - 1];
        }

        // Day
        timestamp += DAY_IN_SECONDS * (_date.day - 1);

        // Hour
        timestamp += HOUR_IN_SECONDS * (_date.hour);

        // Minute
        timestamp += MINUTE_IN_SECONDS * (_date.minute);

        // Second
        timestamp += _date.second;

        return timestamp;
    }

/*
    function addYears(DateTime _date, uint _years) internal pure returns (DateTime) {
        return _date;
    }

    function addDays(DateTime _date, uint _days) internal pure returns (DateTime) {
        return _date;
    }
    */
}