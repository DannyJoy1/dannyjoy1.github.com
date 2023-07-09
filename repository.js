const {
    google
} = require('googleapis');


const client = new google.auth.JWT(
    "microfix-ecommerce@microfix-ecommerce.iam.gserviceaccount.com",
    null,
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFCh26+jXTsrOU\nbABZxVTrLHyHtmGv4lZlJiumGAM5It3w0ZLDg6HduRdeALpJR3395lA94OOJUtR1\nxSTkHqfTIJUQpA4a+OFwJWT1IaIjn9DXl2ekDovOrzH07bRD7TfP7Wnm1iqLeAMx\ncyLCQZbenb2xVg6OS1hDBfns1uSKu4/I3jVzN08bjuyzcVSEKGxrKxO+ExKhJGwY\nYLZE2IfU5yxmnNuFqniq85XYTLmVbdzPtVgQAWr/0bba1rFO3n2ACfnHS/zYduoo\n14lMJJE3TwIfat5+A9mEwaNHRhTUbk3d4ezM5WbG7QuwnYY7Va7wWcZwWqkUXNl3\nyuxTSMLxAgMBAAECggEABT5wgx4574E6g/E0jdm8GamB7kSy0zEAC/TDmvSEUBwh\nnFFKNCIyh8maGcTa2wIS6X5x1UEWcnxTWN0JzyO9DgKNz7cQrwlqSodG6WU0lk51\ntZR7IXkc9xUKNygFBlJvtqdtYZjX4gVWzxVEMAz50cE7SqxtJRP+ly4MtDprM6v1\nOneJ9USPqoV966QbCMrxBo2YXJh9kwllRY2eNoUGmZQs8NM60mJz+nFQdbMElt+w\nYThCBZqFskXcohnFMhjLAyWETKFABR+r2ruhbUE36LS/w+mh+zzPQKmrH5AQv1Dt\niScFP/povfNMr3QOAyDGRqxpRsjMzEA/18UVnp2FKQKBgQDxbD+J/tUdqlxLfrQC\njy5F1q5JxBzq4JKsfuu7v9iaxVCD2I3qwGE9bZ14E5SnUNFYrW82f5xEHUTuXO71\nZqXrN+WIjgvcVbTjd5f8jpLMfStR3rvlA/wtSaTsV9Zai3ttFllrn4qsjWZz4Va3\nmK1oeaq3hw8MedjM1HmflJhA5QKBgQDQ79IAyKErVsFNsi3rcxW43dUvOR71TnsN\nB99TsIhJcLzRKZ1jdWAsQmf2uWuuehgvjlQ8JpBbiKqLGLGOFXpu0e9wo7Q6e+eg\n0fTwr8aVWrZk7vHe2yb8eNFzT732TxAoLHUL+kDc3Bjuo40kUzwEsQxdlBTNvcJj\n91tevpI1HQKBgDT8vTVcaQoJyhgHxxqIsm9Bnx8xm+cxQv/5G2QpxzCw/eryLLPJ\nZY5F8LnaElZmtovwBOjBOVr50Zc/bnMOBHyL2CUQiCnj5b/HD+Supimbj1Z4vGSX\na1HFSB1XagSVeJGIxjeI3Lbikgn8+ztwlx7HFWESk4r5c0wBlnAf/QrBAoGAT6Qq\ng1v2e0OdeVVCxa3fiNEeEtsOHulkZCotCYSP3paXko7vTFsQZq6FXHl/P0mQ8Ier\nOiZk/k8Q2uZ1v7gWLCnfwCrWZziVqSp+2EPYSVQDlGO0VINqz+/pvq+VtE6c1QNl\nNkSU9tr6sfQrt732cb9e/EiWyXncoChIbsvrhU0CgYEA0mh/oaJX8tDGGlXmW0ZL\nKxwpvUBEAL0h1uINHQM/XX5fcg1P8Rfr96je3rWCoL7GI2Sq2/u1c4J/AIXoxZrb\ndqNRQlAgQexf8NrLbJfQjXSGU+zLZmJl/gE7CwjLWW7Qa/bkTH82u6tmiA9bi2Ak\nIwgs8VOXVPzM58DdxEJHHJA=\n-----END PRIVATE KEY-----\n",
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
    if (err) {
        console.error('Error de autenticación:', err);
        return;
    }
    console.log('Autenticación exitosa');
});

const sheets = google.sheets({
    version: 'v4',
    auth: client
});



async function read() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '1n-nuOlzD9pgB33s_rPlUHYk8fU37ajLQNsKmFdn4wqg',
        range: 'Products!A2:F',
    });

    const rows = response.data.values;
    const products = rows.map((row) => ({

        id: +row[0],
        name: row[1],
        price: +row[2],
        image: row[3],
        stock: +row[4],
        desc: row[5]

    }));

    // console.log(products);
    return products;


}

async function write(products) {
    let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock, p.desc]);

    const resource = {
        values,
    };
    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: "1n-nuOlzD9pgB33s_rPlUHYk8fU37ajLQNsKmFdn4wqg",
        range: "Products!A2:F",
        valueInputOption: "RAW",
        resource,
    });
}


/***********************orden de compra datos */
async function writeOrders(orders) {
    let values = orders.map((order) => [
        order.date,
        order.shipping.name,
        order.shipping.tel,
        order.shipping.email,
        JSON.stringify(order.items),
        JSON.stringify(order.shipping),
        order.status,
    ]);

    const resource = {
        values,
    };
    const result = await sheets.spreadsheets.values.append({
        spreadsheetId: "1n-nuOlzD9pgB33s_rPlUHYk8fU37ajLQNsKmFdn4wqg",
        range: "Orders!A2:H",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource,
    });

}


async function search(searchTerm) {
    const products = await read();

    // Realiza la lógica de búsqueda aquí utilizando el término de búsqueda
    const searchResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return searchResults;
}


async function readDetails() {
    const details = await sheets.spreadsheets.values.get({
        spreadsheetId: '1n-nuOlzD9pgB33s_rPlUHYk8fU37ajLQNsKmFdn4wqg',
        range: 'Products!A2:G',
    });

    const rows = details.data.values;
    const productDetails = rows.map((row) => ({

        id: +row[0],
        name: row[1],
        price: +row[2],
        image: row[3],
        stock: +row[4],
        desc: row[5],
        det: row[6]

    }));

    console.log(productDetails);
    return productDetails;


}


module.exports = {
    read,
    write,
    writeOrders,
    search,
    readDetails,
};