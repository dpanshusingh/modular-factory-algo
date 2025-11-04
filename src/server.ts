import { app } from "./app";
import { ENV } from "./config/envConfig";
import { connectDB } from "./config/db";

//connectDB();

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port http://localhost:${ENV.PORT}`);
});