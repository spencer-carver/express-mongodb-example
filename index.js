import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import RestaurantSchema from "./schema/restaurant.js";

const app = express();
const port = 3000;

// assume these come from secrets
const DB_USER = "admin";
const DB_PASSWORD = "<PASSWORD>";
const CLUSTER_NAME= "<CLUSTER NAME>";
const DB_NAME = "sample_restaurants";

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${ CLUSTER_NAME }.nztnb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => console.log(`Connected to ${DB_NAME}`));

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

function removePortIfDev(url) {
    const portRegex = /:[0-9]*$/;
    return url.replace(portRegex, "");
}

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        /*
         * Get rid of port number in dev environment to allow other local apps through. Also, sometimes the origin
         * comes in as the string "null"
        */
        const originToCheck = removePortIfDev(!origin || origin === "null" ? "" : origin);
        const allowlist = [
            "http://localhost"
        ];

        if (!originToCheck || allowlist.includes(originToCheck)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.get('/', (req, res) => {
    const {
        borough = "Manhattan",
        limit = 100
    } = req.query;

    try {
        Restaurant.find({ borough }).limit(limit).exec((err, data) => {
            if (err) {
                throw new Error(err.message);
            }

            console.log(`Query found ${ data.length } restaurants`);

            res.json(data);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// CRUD operations
// CREATE
app.post("/restaurant", (req, res) => {
    try {
        Restaurant.create(request.body).exec((err, data) => {
            if (err) {
                console.error(err);

                throw new Error(err.message);
            }

            res.json(data);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// READ
app.get("/restaurant/:id", (req, res) => {
    const {
        id
    } = req.params;

    try {
        Restaurant.findOne({ restaurant_id: id }).exec((err, data) => {
            if (err) {
                console.error(err);

                throw new Error(err.message);
            }

            res.json(data);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE
app.patch("/restaurant/:id", (req, res) => {
    const {
        id
    } = req.params;

    try {
        Restaurant.findOneAndUpdate({ restaurant_id: id }, request.body).exec((err, data) => {
            if (err) {
                throw new Error(err.message);
            }
            res.json(data);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE
app.delete("/restaurant/:id", (req, res) => {
    const {
        id
    } = req.params;

    try {
        Restaurant.findOneAndRemove({ restaurant_id: id }).exec((err, data) => {
            if (err) {
                throw new Error(err.message);
            }

            res.status(204);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
