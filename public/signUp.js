const timeOutClear = () => {
  setTimeout(() => {errorDiv.innerHTML = ""}, 2000);
}
const errorDiv = document.querySelector("#errorDiv");
const signUp = () => {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  if (name.length < 2) {
    errorDiv.innerHTML = "Name must have at least 2 characters";
    timeOutClear();
  } 
  else if (email.indexOf("@") == -1) {
    errorDiv.innerHTML = "please check your Email address";
    timeOutClear();
  }
  else if (password.length < 4 || password.length > 15) {
    console.log(password.length);
    errorDiv.innerHTML = "password must contain 4-15 tabs";
    timeOutClear();
  }
  else{
    fetch("/signUp", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.message == "ok"){window.location.href = "http://localhost:3000/"}
      else{
        errorDiv.innerHTML = "email is already exist in the system.check if you already have an acount ";
        timeOutClear();
      }
    })
  }
}
