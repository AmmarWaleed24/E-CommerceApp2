import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "User  already exists!", statusCode: 400 };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
};

//create login function

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });

  if (!findUser) {
    return { data: "Incorrect email or password", statusCode: 400 };
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (passwordMatch) {
    return {
      data: generateJWT({
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email,
      }),
      statusCode: 200,
    };
  }
  return { data: "incorrect email or password", statusCode: 400 };
};
const generateJWT = (data: any) => {
  return jwt.sign(
    data,
    "CRgjwQMMZh5Q0no/3E/hfZ7VlhWr0YMSKQKLyQf7ibUfnfaWKb/fYsIVSHPzkCTU"
  );
};
