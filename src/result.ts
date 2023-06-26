export interface PhraseyResultSuccess<V> {
    success: true;
    data: V;
}

export interface PhraseyResultError<E> {
    success: false;
    error: E;
}

export type PhraseyResult<V, E> =
    | PhraseyResultSuccess<V>
    | PhraseyResultError<E>;

export const safeRun = <T>(fn: () => T): PhraseyResult<T, Error> => {
    try {
        const data = fn();
        return { success: true, data };
    } catch (error: any) {
        return parseError(error);
    }
};

export const safeRunAsync = async <T>(
    fn: () => Promise<T>
): Promise<PhraseyResult<T, Error>> => {
    try {
        const data = await fn();
        return { success: true, data };
    } catch (error: unknown) {
        return parseError(error);
    }
};

const parseError = (error: any): PhraseyResultError<Error> => {
    if (error instanceof Error) {
        return {
            success: false,
            error,
        };
    }
    return {
        success: false,
        error: new Error(`${error}`),
    };
};
