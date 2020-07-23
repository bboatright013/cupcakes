const $cupcake_table = $('.table tbody');
const $add_cupcake = $('#cupcake-form button');
const $edit_cupcake = $('.edit-overlay .bg-info');
const $delete_cupcake = $('.edit-overlay .bg-danger');
const $cupcake_overlay = $('.edit-overlay');
const $cancel_edit = $('.cancel');



$(document).ready(getCupcakes);

$add_cupcake.on('click', async function(e){
    e.preventDefault();
    let $flavor = $('#cakeFlavor').val();
    let $size = $('input[name=size]:checked').val();
    let $rating = $('#cakeRate').val();
    let $image = $('#cakePic').val();
    
    let data = {
        $flavor,
        $size,
        $rating,
        $image
        };
    let res = await axios.post('/api/cupcakes', data);
    let lastRes = create_cupcake_html(res.data.cupcake);
    $cupcake_table.append(lastRes);
})

$edit_cupcake.on('click', async function(){
    let flavor =  $('#editCakeFlavor').val();
    let size = $('input[name=size]:checked').val();
    let rating = $('#editCakeRate').val();
    let image = $('#editCakePic').val();
    let id = $cupcake_overlay.attr('data-id');

    let data = {
        flavor,
        size,
        rating,
        image
        };

    let res = await axios.patch(`/api/cupcakes/${id}`, data);
    $cupcake_table.empty();
    await getCupcakes();
    $cupcake_overlay.css('z-index',-10);
    $cupcake_overlay.attr('data-id',-1);
    console.log(res);
});

$delete_cupcake.on('click', async function(){
    let id = $cupcake_overlay.attr('data-id');
    let res = await axios.delete(`/api/cupcakes/${id}`);
    $cupcake_table.empty();
    await getCupcakes();
    $cupcake_overlay.css('z-index',-10);
    $cupcake_overlay.attr('data-id',-1);
    console.log(res);
});

$cancel_edit.on('click', function(){
    $cupcake_overlay.css('z-index',-10);
    $cupcake_overlay.attr('data-id',-1);
})

$cupcake_table.on('click',async function(e){
    //function to display edit overlay when edit button is clicked on for individual cupcake
    let x = e.target;
    if(e.target.classList.contains('edit')){
       let res = await getCupcake(x.parentNode.parentNode.dataset.id);
       $cupcake_overlay.css('z-index',10);
       $cupcake_overlay.attr('data-id',res.data.cupcake.id);
       $('#editCakeFlavor').val(res.data.cupcake.flavor);
       $('#editCakeRate').val(res.data.cupcake.rating);
       $('#editCakePic').val(res.data.cupcake.image);
       console.log(res)
    }    
});



async function getCupcake(cake_id){
    let cupcake = await axios.get(`/api/cupcakes/${cake_id}`);
    return cupcake;
}


async function getCupcakes(){
    // uploads the cupcakes in the database to the DOM
    let jsonCupcakes = await axios.get('/api/cupcakes');
    let cupcakes = jsonCupcakes.data.cupcakes;
    for(cake of cupcakes){
        let res = create_cupcake_html(cake);
        $cupcake_table.append(res);
    }
}


function create_cupcake_html(cake){
    // Turn cake object into formatted html for table
    let html = `
    <tr data-id="${cake.id}">
        <td><div class="d-flex justify-content-center border rounded edit" style="width:30px">X</div></td>
        <td><img src="${cake.image}"></td>
        <td>${cake.flavor}</td>
        <td>${cake.rating}</td>
        <td>${cake.size}</td>
    </tr>
    `;
    return html;
}