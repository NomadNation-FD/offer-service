import { ObjectId } from "mongodb";
import IRepository from "../interfaces/irepository";
import Database from "../services/database";
import IOffer from "../interfaces/ioffer";

class OfferRepository implements IRepository<IOffer> {
    collection = "offers"

    async create(entity: IOffer): Promise<IOffer> {
        const db = await Database.connect();
        const offers = await db.collection<IOffer>(this.collection);
        await offers.insertOne(entity);
        await Database.disconnect();
        return entity;
    }

    async update(entity: Partial<IOffer>): Promise<IOffer | null> {
        const db = await Database.connect();
        const offers = await db.collection<IOffer>(this.collection);
        const _id = new ObjectId(entity._id);
        delete entity._id;

        const result = await offers.findOneAndUpdate(
            { _id },
            { $set: entity },
            { returnDocument: "after" }
        );

        await Database.disconnect();
        return result;
    }

    async delete(entity: IOffer): Promise<boolean> {
        const db = await Database.connect();
        const offers = await db.collection<IOffer>(this.collection);
        const result = await offers.deleteOne(
            { _id: new ObjectId(entity._id) },
        );

        await Database.disconnect();
        return result.deletedCount ? true : false;
    }


    async findById(entity: IOffer): Promise<IOffer | null> {
        const db = await Database.connect();
        const offers = await db.collection<IOffer>(this.collection);
        const foundOffer = await offers.findOne({ _id: new ObjectId(entity._id) });
        await Database.disconnect();
        return foundOffer;
    }

    async findAll(): Promise<IOffer[]> {
        const db = await Database.connect();
        const offers = await db.collection<IOffer>(this.collection);
        const allOffers = await offers.find().toArray();
        await Database.disconnect();
        return allOffers;
    }
}

export default OfferRepository;
