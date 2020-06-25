class Amysql {
	constructor(connection) {
		this._mysql = require("mysql").createConnection(connection);
	}
	connect() {
		return new Promise((resolve, reject) => {
			this._mysql.connect((err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}
	query(query, arg = undefined) {
		return new Promise((resolve, reject) => {
			if (!arg) {
				this._mysql.query(query, (err, res) => {
					if (err) reject(err);
					resolve(res);
				});
			} else {
				this._mysql.query(query, [arg], (err, res) => {
					if (err) reject(err);
					resolve(res);
				});
			}
		});
	}
}

const db = new Amysql({
	user: "root",
	password: "",
	host: "localhost",
	database: "async_me",
});

(async () => {
	try {
		await db.connect();
		console.log("connected!");

		//data reset
		await db.query("delete from pdkt where nama like ? ", "%");

		// single insert
		await db.query("insert into pdkt (nama, asal) values (?)", [
			"allays",
			"sukoharjo",
		]);
		console.log("record 1");
		console.log(JSON.stringify(await db.query("select * from pdkt")));

		//multiple inserts
		await db.query("insert into pdkt (nama, asal) values ?", [
			["laras", "bengkulu"],
			["savira", "mojosongo"],
		]);
		console.log("record 2");
		console.log(JSON.stringify(await db.query("select * from pdkt")));

		//select one
		console.log("record 3");
		console.log(
			JSON.stringify(
				await db.query("select * from pdkt where nama=?", "laras")
			)
		);
	} catch (err) {
		throw err;
	}
})();

/**
 * connected!
 * record 1
 * [{"id":17,"nama":"allays","asal":"sukoharjo"}]
 * record 2
 * [{"id":17,"nama":"allays","asal":"sukoharjo"},{"id":18,"nama":"laras","asal":"bengkulu"},{"id":19,"nama":"savira","asal":"mojosongo"}]
 * record 3
 * [{"id":22,"nama":"laras","asal":"bengkulu"}]
 */
