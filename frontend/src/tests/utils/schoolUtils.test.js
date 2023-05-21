import { onDeleteSuccess, cellToAxiosParamsDelete } from "main/utils/schoolUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x),
    };
});

describe("schoolUtils tests", () => {
    test("onDeleteSuccess puts message in console.log and in a toast", () => {
        const restoreConsole = mockConsole();

        // act
        onDeleteSuccess("abc");

        // assert
        expect(mockToast).toHaveBeenCalledWith("abc");
        expect(console.log).toHaveBeenCalledWith(expect.stringMatching("abc"));

        restoreConsole();
    });

    test("cellToAxiosParamsDelete returns correct params", () => {
        const cell = { row: { values: { id: 17 } } };

        const result = cellToAxiosParamsDelete(cell);

        expect(result).toEqual({
            url: "/api/schools",
            method: "DELETE",
            params: { id: 17 },
        });
    });
});