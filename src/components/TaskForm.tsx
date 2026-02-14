import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Input, Select, Typography } from "antd";

import type { FormikHelpers } from "formik";
import type { Task, TaskStatus } from "../types";

const { TextArea } = Input;
const { Text } = Typography;

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: Partial<Task>) => void;
    initialData?: Task | null;
}

interface TaskFormValues {
    title: string;
    description: string;
    status: TaskStatus;
}

const taskValidationSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .required("Title is required")
        .max(100, "Title must be under 100 characters"),
    description: Yup.string()
        .trim()
        .required("Description is required")
        .max(500, "Description must be under 500 characters"),
    status: Yup.string()
        .oneOf(["todo", "in-progress", "done"], "Invalid status")
        .required("Status is required"),
});

export default function TaskForm({ open, onClose, onSubmit, initialData }: TaskFormProps) {
    const initialValues: TaskFormValues = {
        title: initialData?.title || "",
        description: initialData?.description || "",
        status: initialData?.status || "todo",
    };

    const handleFormSubmit = (values: TaskFormValues, { resetForm }: FormikHelpers<TaskFormValues>) => {
        onSubmit({
            title: values.title.trim(),
            description: values.description.trim(),
            status: values.status,
        });
        resetForm();
        onClose();
    };

    return (
        <Modal
            open={open}
            title={initialData ? "Edit Task" : "New Task"}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={480}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={taskValidationSchema}
                onSubmit={handleFormSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4 pt-2">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                            <Field
                                as={Input}
                                id="title"
                                name="title"
                                placeholder="What needs to be done?"
                                maxLength={100}
                            />
                            <ErrorMessage name="title">
                                {(msg) => <Text type="danger" className="text-xs">{msg}</Text>}
                            </ErrorMessage>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                            <Field
                                as={TextArea}
                                id="description"
                                name="description"
                                placeholder="Add more details..."
                                rows={3}
                                maxLength={500}
                            />
                            <ErrorMessage name="description">
                                {(msg) => <Text type="danger" className="text-xs">{msg}</Text>}
                            </ErrorMessage>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <Select
                                value={values.status}
                                onChange={(v) => setFieldValue("status", v)}
                                className="w-full"
                                options={[
                                    { value: "todo", label: "To Do" },
                                    { value: "in-progress", label: "In Progress" },
                                    { value: "done", label: "Done" },
                                ]}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={onClose} className="ant-btn ant-btn-default px-4 py-1 rounded-md border border-border hover:bg-muted transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting} className="ant-btn ant-btn-primary px-4 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                                {initialData ? "Save Changes" : "Create Task"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}
