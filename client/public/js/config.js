const env = 'LOCAL';

switch(env) {
    case 'LOCAL': 
        window.config = {
            apiUrl: 'http://localhost:2010'
        };
        break;
        
    case 'DEV':  
        window.config = {
            apiUrl: 'http://localhost:2010'
        };
        break;

    case 'PROD': 
        window.config = {
            apiUrl: 'http://localhost:2010'
        };
        break;
}

