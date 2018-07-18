function Modal(modalId) {
    const _this = this; 
    const _id = modalId;

    this.open = () => {
        let modal = document.getElementById(modalId); 
        var closer = document.getElementsByClassName("close")[0];
        modal.style.display = 'block'; 

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }; 
        closer.onclick = function() {
            modal.style.display = "none";
        }; 
    }; 

    this.close = () => {
        let modal = document.getElementById(modalId); 
        modal.style.display = 'none'; 
    }
}