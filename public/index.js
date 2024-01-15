const emailElement = document.querySelector("#email");

const passwordElement = document.querySelector("#password");

const errorDiv = document.querySelector("#errorDiv");



const signIn = () => {

  let email = emailElement.value;

  let password = passwordElement.value;

  fetch("/signIn", {

    method: "post",

    headers: { "Content-Type": "application/json"},

    body: JSON.stringify({ email, password }),

  })

  .then((res) => res.json())

  .then((data) => {

    console.log(data.message);

    if (data.message == "ok") {

      window.location.href = "http://localhost:3000/shop";

    } else {

      errorDiv.innerHTML = "no user found,please signUp or try again";

      setTimeout(() => {

        errorDiv.innerHTML = "";

      }, 2000);

    }

    });

};

const signUp = () => {

  window.location.href = "http://localhost:3000/signUp";

};

