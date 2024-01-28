// pages/api/session.js
export default function checkLogin() {
	const jwt = localStorage.getItem("jwt");

	if (!jwt) {
		return false;
	} else {
		return true;
	}
}
