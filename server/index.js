const {
  client,
  createTables,
  createUser,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite,
  createProduct,
} = require("./db");

const express = require("express");
const app = express();



// init function to connect to database
const init = async () => {
  await client.connect();
  console.log("connected to database");

  await createTables();
  console.log("tables created");

  const [andrew, kathy, maui, bowlingBall, camera, palette, lipStick, bone] =
    await Promise.all([
      createUser({ username: "andrew", password: "pw1" }),
      createUser({ username: "kathy", password: "pw2" }),
      createUser({ username: "maui", password: "pw3" }),
      createProduct({ name: "bowlingBall" }),
      createProduct({ name: "camera" }),
      createProduct({ name: "palette" }),
      createProduct({ name: "lipStick" }),
      createProduct({ name: "bone" }),
    ]);

    const createProducts = await Promise.all([
        createFavorite({user_id: andrew.id, product_id: bowlingBall.id}),
        createFavorite({user_id: andrew.id, product_id: camera.id}),
        createFavorite({user_id: kathy.id, product_id: palette.id}),
        createFavorite({user_id: kathy.id, product_id: lipStick.id}),
        createFavorite({user_id: maui.id, product_id: bone.id}),
        createFavorite({user_id: maui.id, product_id: camera.id}),
    ]);
    console.log("data seeded");

    // get products

    // create favorites

    // delete favorites

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
