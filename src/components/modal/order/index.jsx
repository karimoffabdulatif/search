/* eslint-disable react/prop-types */
import {
  Modal,
  Backdrop,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { orderValidationSchema } from "../../../utils/validation";
import service from "../../../service/service";
import order from "../../../service/order";
import { useState, useEffect } from "react";

const Fade = ({ children, in: open }) => {
  const style = {
    opacity: open ? 1 : 0,
    transition: "opacity 0.5s",
  };

  return <div style={style}>{open ? children : null}</div>;
};

const Index = ({ open, handleClose, item }) => {
  console.log(item, "item");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await service.get({ limit: 10, page: 1 });
        if (response.status === 200 && response.data?.services) {
          setData(response.data.services);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const initialValues = {
    client_full_name: item?.client_full_name || "",
    client_phone_number: item?.client_phone_number || "",
    amount: item?.amount || "",
    service_id: item?.service_id || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (item) {
        const payload = { id: item.id, ...values };
        const response = await order.update(payload);
        if (response.status === 201) {
          window.location.reload();
        }
      } else {
        const response = await order.create(values);
        if (response.status === 201) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ my: 2, textAlign: "center" }}>
            {item ? "Edit Order" : "Create Order"}
          </Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={orderValidationSchema}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  name="client_full_name"
                  type="text"
                  as={TextField}
                  label="Full name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText={<ErrorMessage name="client_full_name" component="div" style={{ color: 'red' }} />}
                />
                <Field
                  name="client_phone_number"
                  type="text"
                  as={TextField}
                  label="Phone"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText={<ErrorMessage name="client_phone_number" component="div" style={{ color: 'red' }} />}
                />
                <Field
                  name="amount"
                  type="number"
                  as={TextField}
                  label="Amount"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText={<ErrorMessage name="amount" component="div" style={{ color: 'red' }} />}
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="service_id_label">Select a service</InputLabel>
                  <Field
                    name="service_id"
                    as={Select}
                    labelId="service_id_label"
                    id="service_id"
                    label="Select a service"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select a service
                    </MenuItem>
                    {data.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <FormHelperText>
                    <ErrorMessage name="service_id" component="div" style={{ color: 'red' }} />
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ marginTop: "8px" }}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Fade>
    </Modal>
  );
};

export default Index;
