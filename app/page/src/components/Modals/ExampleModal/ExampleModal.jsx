import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';

const ExampleModal = ({ closeModal }) => (
  <div>
    <ModalHeader title={'Report lost'} closeModal={closeModal} />
    <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Etiam vulputate quam quis nunc mattis dictum.
        Donec eu justo vitae mauris facilisis cursus facilisis nec libero.
        Donec consequat dictum leo.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel viverra ante.
        In fringilla lacus id dui elementum, ac dapibus risus maximus.
        Vestibulum feugiat lacinia urna in dapibus. Integer suscipit pharetra ipsum ut imperdiet.
        Aliquam eleifend volutpat nisi, vel venenatis ligula imperdiet eu.
        Suspendisse venenatis aliquet justo vitae eleifend.
        Suspendisse porttitor mi non nunc consectetur dapibus.
        Aenean fermentum feugiat venenatis. Nunc posuere erat nunc,
        quis vestibulum ipsum pretium sed.
        Pellentesque sodales sem sit amet nisi venenatis, at maximus dolor efficitur.
        Quisque aliquam, lacus vehicula pretium suscipit, sapien sapien commodo massa,
        id mollis enim urna vel est. Donec auctor justo a congue lacinia.
        In volutpat nisl non mi placerat, sed vestibulum purus volutpat.
        Curabitur sagittis ante ultrices sapien facilisis pulvinar. Sed tortor erat,
        elementum vitae venenatis non, pulvinar a felis. Donec mollis ante arcu,
        at pulvinar orci volutpat id.
        Quisque gravida luctus turpis, non gravida urna vestibulum non.
        Integer dapibus nulla eu justo vulputate volutpat.
        Morbi mollis elit eu ex condimentum tempus.
        Aliquam nec elit ultrices, ultrices mi eget, malesuada augue. Interdum et
        malesuada fames ac ante ipsum primis in faucibus. Aliquam eu dui eu urna
        scelerisque porta in et ligula. Fusce in ligula et lectus facilisis blandit et eu odio.
        Nullam aliquam ornare justo, in accumsan quam mattis vel.
        Integer eget luctus mi. Mauris vitae arcu vel ex fringilla blandit.
        Ut metus sem, cursus sed ultrices ut, rhoncus vitae lectus. Ut commodo elit eu elit
        ullamcorper congue. Donec nisi mauris, aliquam in ex in, tincidunt scelerisque leo.
        Sed aliquam purus eros, et laoreet est lacinia non. Ut a nisl urna. Cras consectetur
        lorem vitae mauris sollicitudin lobortis. Fusce vel euismod ipsum.
        Suspendisse ultrices tempor dui a dictum. Integer vestibulum lorem nec vehicula blandit
        Pellentesque tortor neque, tempus in lorem in, faucibus commodo tellus.
        Donec accumsan nulla nec mauris tempor, non eleifend sem laoreet. Nunc
        pretium eros ex, sit amet dapibus diam auctor nec. Donec massa quam,
        ornare vel lectus non, ullamcorper rutrum dui. Cras diam lacus, mattis
        ac dignissim et, commodo at dui. Proin pellentesque, nibh at semper
        dapibus, felis ex tristique est, in iaculis magna felis a elit. Pellentesque.
    </ModalBody>
  </div>
);

ExampleModal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default ExampleModal;
