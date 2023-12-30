import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:8000",
});

export const setAuthToken = (token) => {
	instance.defaults.headers = {
		Authorization: token ? `Bearer ${token}` : "",
	};
};

export const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	if (!token) {
		return false;
	}
	return true;
};

export const loginService = async (payload) => {
	try {
		console.log(payload);
		const { data } = await instance.post(`/api/v1/auth/login`, payload);
		return data;
	} catch (err) {
		const { data } = err.response;
		throw data;
	}
};

export const registrationService = async (payload) => {
	try {
		const { data } = await instance.post(
			`/api/v1/auth/registration`,
			payload
		);
		return data;
	} catch (err) {
		const { data } = err.response;
		throw data;
	}
};

export const verifyOTPService = async (payload) => {
	try {
		const { data } = await instance.post(
			`/api/v1/auth/otp-verification`,
			payload
		);
		return data;
	} catch (err) {
		console.log(err.response.message);
		const { data } = err.response;
		throw data;
	}
};

export const verifyAccount = async (email) => {
	try {
		const { data } = await instance.post(
			`/api/v1/auth/account-verification`,
			{
				email,
			}
		);
		return data;
	} catch (err) {
		const { data } = err.response;
		throw data;
	}
};

export const resendOTP = async (payload) => {
	try {
		const { data } = await instance.post(`/api/v1/auth/otp-send`, payload);
		return data;
	} catch (err) {
		console.log(err);
		const { data } = err.response;
		throw data;
	}
};

export const updatePassword = async (payload) => {
	try {
		const { data } = await instance.post(
			`/api/v1/auth/update-password`,
			payload
		);
		return data;
	} catch (err) {
		console.log(err);
		const { data } = err.response;
		throw data;
	}
};

export const getUserData = async () => {
	try {
		const { data } = await instance.get(`/api/v1/user/details`);
		return data;
	} catch (err) {
		console.log(err);
		const { data } = err.response;
		throw data;
	}
};
