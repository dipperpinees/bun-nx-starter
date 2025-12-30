import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { AppApiSuccessResponse } from './app-api-success';

export const ApiSuccessResponse = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
    nullable = false
) =>
    applyDecorators(
        ApiExtraModels(AppApiSuccessResponse, dataDto),
        ApiOkResponse({
            schema: {
                required: nullable ? [] : ['data'],
                allOf: [
                    { $ref: getSchemaPath(AppApiSuccessResponse) },
                    {
                        required: nullable ? [] : ['data'],
                        properties: {
                            data: {
                                $ref: getSchemaPath(dataDto),
                            },
                        },
                    },
                ],
            },
        })
    );
