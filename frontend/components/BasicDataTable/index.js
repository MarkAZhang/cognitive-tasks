import PropTypes from '~/utils/propTypes'
import cx from 'classnames'

import cs from './styles.css'
import { isObject, isArray } from 'lodash/fp';

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

  return (
    <div className={cx(cs.table, props.className)}>
      <div className={cs.row}>
        {props.columns.map(column =>
          <div
            className={cx(cs.cell, cs.header)}
            style={column.grow && { flexGrow: column.grow }}
            key={column.header}
          >
            {column.header}
          </div>
        )}
      </div>
      {props.data.map((datum, index) =>
        <div className={cs.row} key={index}>
          {props.columns.map(column =>
            <div
              className={cx(cs.cell, props.tall && cs.tall)}
              style={column.grow && {flexGrow: column.grow}}
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
