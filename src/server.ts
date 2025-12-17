import app from "./app";
import config from "./config";





const port = config.port || 4000;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})