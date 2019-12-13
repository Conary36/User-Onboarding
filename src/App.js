import React, {useState, useEffect} from "react";
// import ReactDOM from "react-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function LoginForm({ values, errors, touched, isSubmitting }) {

  const [users, setUsers] = useState([]);

  useEffect(()=>{
    console.log("submition!", isSubmitting);

    isSubmitting && setUsers(users => [...users, isSubmitting]);
  }, [isSubmitting]);

  return (
    <div>
    <Form>
      <div>
        {touched.email && errors.email && <p>{errors.email}</p>}
        <Field id="email" type="email" name="email" placeholder="Email" />
      </div>
      <div>
        {touched.password && errors.password && <p>{errors.password}</p>}
        <Field id="password" type="password" name="password" placeholder="Password" />
      </div>
      <label>
        <Field type="checkbox" name="tos" checked={values.tos} />
        Accept TOS
      </label>
      <Field component="select" name="meal">
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="platinum">Platinum</option>
      </Field>
      <button disabled={isSubmitting}>Submit</button>
    </Form>
    {users.map(user => {
      return (
      <ul key={user.id}>
        <li>Email:{user.email}</li>
        <li>Password:{user.password}</li>
      </ul>
      );
      })}
  </div>
  );
}

const FormikLoginForm = withFormik({
  mapPropsToValues({ email, password, tos, meal }) {
    return {
      email: email || "",
      password: password || "",
      tos: tos || false,
      meal: meal || "silver"
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6 characters or longer")
      .required("Password is required")
  }),
  handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
    if (values.email === "cbeckford144@gmail.com") {
      setErrors({ email: "That email is already taken" });
    } else {
      axios
        .post(" https://reqres.in/api/users", values)
        .then(res => {
          console.log(res); // Data was created successfully and logs to console
          resetForm();
          setSubmitting(false);
        })
        .catch(err => {
          console.log(err); // There was an error creating the data and logs to console
          setSubmitting(false);
        });
    }
  }
})(LoginForm);

export default FormikLoginForm;