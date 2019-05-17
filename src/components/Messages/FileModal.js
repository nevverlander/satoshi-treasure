import React from "react";
import mime from "mime-types";
import { Modal, Button, Icon, Input } from "semantic-ui-react";

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png", "image/gif"],
    maxFileSize: 10 //in MB
  };

  addFile = event => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  isAuthorized = file => {
    let size = file.size / 1024 / 1024; //in MB
    console.log(size);
    if (size > this.state.maxFileSize) {
      alert("Max file size is " + this.state.maxFileSize + " MB");
    }
    let type = this.state.authorized.includes(mime.lookup(file.name));
    if (!type) {
      alert("Supported types are " + JSON.stringify(this.state.authorized));
    }
    return size < this.state.maxFileSize && type;
  };

  clearFile = () => this.setState({ file: null });

  render() {
    const { modal, closeModal } = this.props;

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            label="File types: jpg, png, gif; max size 10MB"
            name="file"
            type="file"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.sendFile} color="green" inverted>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
