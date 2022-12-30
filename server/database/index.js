import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true, });


class dbClient {
    constructor(collection) {
        this.collectionName = collection;
    }
    client = new MongoClient("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true, });
    findOne = async (query) => {
        try {
            await client.connect();
            console.log("mongodb连接,collection=" + this.collectionName);
            const collection = client.db('carpoolPlatform').collection(this.collectionName);
            return await collection.findOne(query);
        }catch(err){
            console.log(err);
        } 
        finally {
            await client.close();
        }
    }
    dropOne = async (query) => {
        try {
            await client.connect();
            console.log("mongodb连接,collection=" + this.collectionName);
            const collection = client.db('carpoolPlatform').collection(this.collectionName);
            return await collection.deleteOne(query);
        } finally {
            await client.close();
        }
    }
    insertOne = async (data) => {
        try {
            await client.connect();
            console.log("mongodb连接,collection=" + this.collectionName);
            const collection = client.db('carpoolPlatform').collection(this.collectionName);
            return await collection.insertOne(data);
        } finally {
            await client.close();
        }
    }
}

export default dbClient;