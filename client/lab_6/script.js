/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log('fired cut list')
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length -1);
    return list[index]
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector('#data_load')
  const loadDataButton = document.querySelector('.generate')
  const generateListButton = document.querySelector('.filter')

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';

  let currentList = [];

  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    console.log('Loading data'); // this is substituting for a "breakpoint"
    loadAnimation.style.display = 'inline-block';

    /*
      ## GET requests and Javascript
        We would like to send our GET request so we can control what we do with the results
        But this blocks us sending a query string by default - ?resto='' won't exist

        Let's get those form results before sending off our GET request using the Fetch API
    */

      // this is a basic GET request
      // It does not include any of your form values, though

    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    currentList = await results.json();
    loadAnimation.style.display = 'none';
    console.table(currentList);
  });


  filterButton.addEventListener('click', (event) => {
    console.log('clicked FilterButton');

    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);
    injectHTML(currentList);
    console.log(newList);

  })

  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list')
    const restaurantsList = cutRestaurantList(currentList);
    console.log('restaurantsList')
    injectHTML(restaurantsList);
  })
}
    /*
   ## Get request with query parameters

      const results = await fetch(`/api/foodServicePG?${new URLSearchParams(formProps)}`);

      The above request uses "string interpolation" to include an encoded version of your form values
      It works because it has a ? in the string
      Replace line 37 with it, and try it with a / instead to see what your server console says

      You can check what you sent to your server in your GET request
      By opening the "network" tab in your browser developer tools and looking at the "name" column
      This will also show you how long it takes a request to resolve
    */

    // This changes the response from the GET into data we can use - an "object"
    //const arrayFromJson = await results.json();
    //console.table(arrayFromJson.data); // this is called "dot notation"
    // arrayFromJson.data - we're accessing a key called 'data' on the returned object
    // it initially contains all 1,000 records from your request
  


/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests