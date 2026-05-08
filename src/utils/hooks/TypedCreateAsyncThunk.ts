import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkPayloadCreator, AsyncThunkOptions } from "@reduxjs/toolkit";

export default function TypedCreateAsyncThunk<
	ResponseType,
	ParameterType,
	ErrorType = string,
>(
	typePrefix: string,
	payloadCreator: AsyncThunkPayloadCreator<
		ResponseType,
		ParameterType,
		{
			rejectValue: ErrorType;
		}
	>,
	options?: AsyncThunkOptions<ParameterType>
) {
	return createAsyncThunk<
		ResponseType,
		ParameterType,
		{ rejectValue: ErrorType }
	>(typePrefix, payloadCreator, options);
}
