const AddressUnitType = {
  type: {
    id: { type: String, require: true },
    name: { type: String, require: true },
  },
};

const AddressType = {
  type: {
    houseNumber: { type: String, require: true },
    province: AddressUnitType,
    district: AddressUnitType,
    commune: AddressUnitType,
  },
  required: false,
};

export { AddressUnitType, AddressType };
