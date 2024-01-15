// pages/api/session.js
import { NextApiRequest, NextApiResponse } from "next";

export default function checkLogin() {
	const jwt = localStorage.getItem("jwt");

	if (!jwt) {
		return false;
	} else {
		return true;
	}
}
