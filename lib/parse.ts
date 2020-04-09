import { BankInfo } from "./banks";

export default (clearingAndAccount: string, type: BankInfo['type'], comment: BankInfo['comment']) => {
  const clearing = clearingAndAccount.substr(0, clearingAndAccount.charAt(0) === "8" ? 5 : 4);

  const account =
    // Samtliga konton av typ 1
    type === 1 ? clearingAndAccount.substr(-7) :
      // Handelsbankens koton av typ 2
      type === 2 && comment === 2 ? clearingAndAccount.substr(-9) :
        // Swedbanks konton av typ 2
        type === 2 && comment === 3 && clearingAndAccount.charAt(0) === "8" ? clearingAndAccount.substr(5) :
          // Plusgirots konton av typ 2
          type === 2 && comment === 3 && clearingAndAccount.charAt(0) === "9" ? clearingAndAccount.substr(4) :
            // Resterande konton av typ 2
            clearingAndAccount.substr(-10);

  return {
    clearing,
    account
  }
}
