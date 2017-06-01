'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';

import helpers, {translate} from '../../utils/helpers';


/* Component ==================================================================== */
class FileItem extends Component {

  static defaultProps = {
    name: translate('fileItemFallbackName'), //rnder als Unknown
    size: '1000', //the defult file size
    id: '', //no id
    removeFile: () => {}
  };

  constructor(props) {
    super(props);
  }
  /**
   * RENDER
   */
  render = () => {
    return (
      <li key={this.props.name} className={'ln-file--list-item'}>
        <div>
          <span className="ln-file--name">{this.props.name}</span>
        </div>
        <div>
          <span className="ln-file--size">{helpers.prettyBytes(JSON.parse(this.props.size))}</span>
          <button title={translate('fileItemTitle', this.props.name)} type="button" className={'ln-btn ln-btn-primary ln-btn-small'} data-id={this.props.id} onClick={this.props.removeFile.bind(this)}>
            <span className={'ln-icon ln-icon-delete'}></span>
          </button>
        </div>
      </li>
    );
  }
}

// * Export Component ==================================================================== * /
export default FileItem;
