(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


//icons
let icons = document.querySelectorAll(".filter");
icons.forEach((icon) => {
  icon.addEventListener("click", async (e) => {
    e.preventDefault();
    const clickedElement = e.target.closest("p");
    const category = clickedElement.textContent;
    if (clickedElement.tagName === "P") {
      console.log("Clicked on <p>: ", clickedElement.textContent);
      try{
        const response=await fetch(`http://localhost:8080/listings/icons?icon=${clickedElement.textContent}`,{
          method:"GET",
          headers:{"Content-Type" : "text/html"},
        });
        if(response.ok){
        window.location.href = `http://localhost:8080/listings/icons?icon=${category}`;
      }
      else{
        alert("Empty list for this category")
      }
        
      }catch(err){
        console.log(err);
      };
    } else {
      console.log("Clicked on:", clickedElement.tagName);
    }
  });
});
