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

app.use(express.json());
app.use(require("morgan")("dev"));

// GET users
app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});

// GET products
app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});

// GET favorites
app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (error) {
    next(error);
  }
});

// CREATE products
app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        product_id: req.body.product_id,
        user_id: req.params.id,
      })
    );
  } catch (error) {
    next(error);
  }
});

// DELETE products
app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({ user_id: req.params.userId, id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

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
    createFavorite({ user_id: andrew.id, product_id: bowlingBall.id }),
    createFavorite({ user_id: andrew.id, product_id: camera.id }),
    createFavorite({ user_id: kathy.id, product_id: palette.id }),
    createFavorite({ user_id: kathy.id, product_id: lipStick.id }),
    createFavorite({ user_id: maui.id, product_id: bone.id }),
    createFavorite({ user_id: maui.id, product_id: camera.id }),
  ]);
  console.log("data seeded");

  // get products
  console.log(`curl localhost:3000/api/users/${andrew.id}/favorites`);
  const firstProductId = (await fetchFavorites(andrew.id))[0].id;

  // create favorites
  console.log(
    `curl -X POST localhost:3000/api/users/${andrew.id}/favorites -d '{"product_id": "${bone.id}"}' -H 'Content-Type:application/json'`
  );
  // delete favorites
  console.log(
    `curl -X DELETE localhost:3000/api/users/${andrew.id}/favorites/${firstProductId}`
  );

  //   connect to port 3000
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
