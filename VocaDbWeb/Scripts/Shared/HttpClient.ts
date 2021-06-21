import AjaxHelper from '@Helpers/AjaxHelper';
import axios from 'axios';
import { injectable } from 'inversify';
import 'reflect-metadata';

export class HeaderNames {
	public static readonly ContentType = 'Content-Type';
}

export class MediaTypes {
	public static readonly APPLICATION_FORM_URLENCODED =
		'application/x-www-form-urlencoded';
	public static readonly APPLICATION_JSON = 'application/json';
}

export interface ErrorResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: any;
}

export interface HttpClientError<T = ErrorResponse> extends Error {
	response?: T;
}

@injectable()
export default class HttpClient {
	public delete = async <T>(url: string): Promise<T> => {
		const response = await axios.delete<T>(url);
		return response.data;
	};

	public get = async <T>(url: string, data?: any): Promise<T> => {
		const response = await axios.get<T>(url, {
			params: data,
			// HACK: This is required for advanced search filters.
			paramsSerializer: AjaxHelper.stringify,
		});
		return response.data;
	};

	public post = async <T>(
		url: string,
		data?: any,
		config?: { headers?: any },
	): Promise<T> => {
		const response = await axios.post<T>(url, data, config);
		return response.data;
	};

	public put = async <T>(url: string, data?: any): Promise<T> => {
		const response = await axios.put<T>(url, data);
		return response.data;
	};
}
