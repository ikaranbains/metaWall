import { openDB } from "idb";
import Swal from "sweetalert2";

const dbName = "metaWallet";
const userStore = "users";

// initialize db
export const initDB = async () => {
	return openDB(dbName, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(userStore)) {
				const store = db.createObjectStore(userStore, {
					keyPath: "id",
					autoIncrement: true,
				});
				store.createIndex("email", "email", { unique: true });
			}
		},
	});
};

// add data in store in db
export const addData = async (data) => {
	const db = await initDB();
	await db.put(userStore, data);
	new Swal("Data Added Sucessfully!!");
};

// get specific data from store
export const getData = async (email) => {
	const db = await initDB();
	return await db.getFromIndex(userStore, "email", email);
};

//get all data from store
export const getAllData = async () => {
	const db = await initDB();
	return db.getAll(userStore);
};

// delete data from store
export const deleteData = async (id) => {
	const db = await initDB();
	await db.delete(userStore, id);
};

// update data in store
export const updateData = async (newData, id) => {
	const db = await initDB();
	const existing = db.get(userStore, id);

	if (!existing) throw new Error("User not found!!");

	const updatedData = { ...existing, ...newData };

	await db.put(userStore, updatedData);
	new Swal("Data Updated Sucessfully!!");
};
