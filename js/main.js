

function getFetch(){
  let inputVal = document.getElementById("barcode").value

  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
          //call additional stuff
        if (data.status === 1){
          const item = new ProductInfo(data.product)
          item.showInfo()
          item.listIngredients()
        } else if (data.status === 0){
          alert(`Product ${inputVal} not found. Please try another`)}
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo { //passing in data.product
  constructor (productData){
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.img = productData.image_url
    }

    showInfo(){
      document.getElementById("product-img").src = this.img
      document.getElementById("product-name").innerText = this.name
    }

    listIngredients(){
      let tableRef = document.getElementById('ingredient-table') // targets the existing table in HTML

      for(let i=1; i< tableRef.rows.length;){
        tableRef.deleteRow(i) //deletes previously made table rows
      }
      if(!(this.ingredients == null)){ //do not enter for loop if no ingredients
        const badIngredients = ["corn", "maltodextrin", "dextrose", "dextrin", "fructose", "hydrol", "ethanol", "maize", "zein", "sorbitol"] // array of ingredients to check
        for( let key in this.ingredients){ //key tells me what number of index
          let newRow = tableRef.insertRow(-1) //insert row at end of table
          let newICell = newRow.insertCell(0) // first cell in row because array indexing
          // let newVCell = newRow.insertCell(1)  // second cell
          let newCornCell = newRow.insertCell(1) //third cell
          let newIText = document.createTextNode(
            this.ingredients[key].text
          )
          // let vegStatus = this.ingredients[key].vegetarian ?  this.ingredients[key].vegetarian : "unknown" // turnary to return falsy values as "unknown" gentler to non-computer friends
          // let newVText = document.createTextNode(vegStatus)
          let cornStatus = "🤷" // setting corn status prior to loop so it can be manipulated and so we don't have to set up default
          for (const pattern of badIngredients) { // of give string out of array, in gives index
            if (this.ingredients[key].text.includes(pattern) ){
                console.log(this.ingredients[key].text)
                console.log(pattern)
              cornStatus = "🌽🌽🌽🌽🌽"
              break // gets out of pattern loop
              }
          }

          let newCornText = document.createTextNode(cornStatus)
          newICell.appendChild(newIText)
          // newVCell.appendChild(newVText)
          newCornCell.appendChild(newCornText)

          // if (vegStatus === "no"){
          //   newVCell.classList.add( "non-veg-item" )
          // } else if ( vegStatus === "unknown" || vegStatus === "maybe"){
          //   newVCell.classList.add("unknown-maybe-item")
          // }

          if (cornStatus === "corn"){
            newCornCell.classList.add( "has-corn" )
          } 
        }
        }
      }
    }

