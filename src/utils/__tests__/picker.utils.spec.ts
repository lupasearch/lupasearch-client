import {
  getPageCount,
  pick,
  pickClosestNumber,
  reverseKeyValue,
} from "../picker.utils";

describe("picker.utils", () => {
  it("getPageCount should return correct page count", () => {
    expect(getPageCount(50, 50)).toBe(1);

    expect(getPageCount(25, 50)).toBe(1);

    expect(getPageCount(50, 25)).toBe(2);

    expect(getPageCount(50, 49)).toBe(2);

    expect(getPageCount(23, 10)).toBe(3);
  });

  it("pickClosestNumber should return correct closest number", () => {
    expect(pickClosestNumber([10, 20, 25, 50], 30)).toBe(25);

    expect(pickClosestNumber([10, 20, 25, 50], 2)).toBe(10);

    expect(pickClosestNumber([10, 20, 25, 50], 100)).toBe(50);
  });

  it("pick should pick correct properties", () => {
    expect(
      pick({ property1: "", property2: "", property3: "" }, [
        "property1",
        "property3",
      ])
    ).toStrictEqual({
      property1: "",
      property3: "",
    });
  });

  it("reverseKeyValue should reverse keys and values correctly", () => {
    expect(
      reverseKeyValue({ KEY1: "value1", key2: "value2", key3: "value3" })
    ).toStrictEqual({
      value1: "key1",
      value2: "key2",
      value3: "key3",
    });
  });
});
