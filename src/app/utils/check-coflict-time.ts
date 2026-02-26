import stringToMuniteInNumber from "./string-to-mimute-in-number";

// creat checkConfictTime function
const checkIsSlotBooked = (
  slotStartTime: string,
  // slotEndTime: string,
  bookingStartTime: string,
  // bookingEndTime: string,
) => {
  // start time of first booking in mumber
  const slotStartTimeInNumber = stringToMuniteInNumber(slotStartTime);

  // end time of first booking in mumber
  // const slotEndTimeInNumber = stringToMuniteInNumber(slotEndTime);

  // start time of each booking in mumber
  const bookingStartTimeInNumber = stringToMuniteInNumber(bookingStartTime);

  // end time of each booking in mumber
  // const bookingEndTimeInNumber = stringToMuniteInNumber(bookingEndTime);

  // // check if time is conflict or not
  // if (
  //   (slotStartTimeInNumber > bookingStartTimeInNumber &&
  //     slotStartTimeInNumber < bookingEndTimeInNumber) ||
  //   (slotEndTimeInNumber > bookingStartTimeInNumber &&
  //     slotEndTimeInNumber < bookingEndTimeInNumber)
  // ) {
  //   // means time will be conflict
  //   return true;
  // }

  // check if the slot already booking or not
  if (slotStartTimeInNumber === bookingStartTimeInNumber) {
    // means, this slot is booking
    return true;
  }

  // time will ne not conflict
  return false;
};

export default checkIsSlotBooked;
