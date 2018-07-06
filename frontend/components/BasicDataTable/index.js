import PropTypes from '~/utils/propTypes'
import cx from 'classnames'

import cs from './styles.css'
import { sum, isObject, isArray } from 'lodash/fp';

const renderData = data => {
  if (isObject(data) || isArray(data)) {
    return JSON.stringify(data)
  }
  return data
}

const BasicDataTable = props => {
  if (!props.data) {
    return (
      <div className={cs.loadingMsg}>Loading...</div>
    )
  }

  const rowWidth = sum(props.columns.map(column => column.width || 200))

  return (
    <div className={cx(cs.table, props.className)}>
      <div className={cs.row} style={{width: rowWidth}}>
        {props.columns.map(column =>
          <div
            className={cx(cs.cell, cs.header)}
            style={{flexBasis: column.width || 200}}
            key={column.header}
          >
            {column.header}
          </div>
        )}
      </div>
      {props.data.map((datum, index) =>
        <div className={cs.row} style={{width: rowWidth}} key={index}>
          {props.columns.map(column =>
            <div
              className={cx(cs.cell, props.tall && cs.tall)}
              style={{flexBasis: column.width || 200}}
              key={column.key}
            >
              {renderData(datum[column.key])}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

BasicDataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    grow: PropTypes.number,
  })),
  data: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  tall: PropTypes.bool,
}

export default BasicDataTable
