import * as check_list from './check_list' ;

export default class ApiForm {

	ID = '5c962c460df1b023e6654af209cae82b';
	SID = '4fc852140f8ac4e880c7b6543f9b6896';
	EMAIL = 'info@incube.world';
	API_MAIL = 'https://api.sendpulse.com';
	GRAND_TYPE = 'Ed Tech';

	SHEET_URL = 'https://sheet.best/api/sheets/fc11ea0e-9caf-46c1-95a1-55517d16c0ad';

	token = '';

	getEToken() {
		const reqToken = JSON.stringify({
			grant_type: 'client_credentials',
			client_id: this.ID,
			client_secret: this.SID
		});

		return fetch(this.API_MAIL + '/oauth/access_token', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: reqToken
		}).then((result) => {
			//const token: TokenResponse = result.json;
			//this.token = [token.token_type, token.access_token].join(' ');
			return result.json();
		}).then(data => {
			this.token = [data.token_type, data.access_token].join(' ');
			console.info('getEToken', this.token);
			return [data.token_type, data.access_token].join(' ');
		});
	}

	sendMail(name, email) {
		this.getEToken().then(token => {
			const mailBody = JSON.stringify({
				template: {
					id: "010d6d55fb8a61734331ac31bc67621b",
					variables: {
						name
					}
				},
				subject: "Test Belbina",
				from : {"name": "Ed Tech", "email": this.EMAIL},
				to: [{ name, email}],
				attachments_binary: {
					"Чек-лист теста Белбина.pdf" : check_list
				}
			});


			fetch(this.API_MAIL + '/smtp/emails', {
				method: 'post',
				headers: {'Content-Type': 'application/json', 'Authorization': token},
				body: mailBody
			}).then((result) => {
				//const token: TokenResponse = result.json;
				//this.token = [token.token_type, token.access_token].join(' ');
				return result.json();
			}).then(data => {
				console.info('sendMail', data);
			});
		});
	}

	sendData(name, phone, email) {
		return fetch(this.SHEET_URL, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name,
				phone,
				email,
				date: (new Date()).toLocaleString()
			})
		}).then(response => response.json());

	}
}