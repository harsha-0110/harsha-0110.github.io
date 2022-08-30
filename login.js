function validate() {
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if(username=="admin" && password=="pass123") {
        return true;
    }
    else {
        alert("Login Failed :(\nEnter a valid Username and Password");
        return false;
    }
}