import spinner from '../assets/spinner.svg'
import { DataType, LOADING_STATE } from '../types/types'

interface Props {
  // data: string[] | DataType[]
  data: any
  isLoading: LOADING_STATE
  type: 'fetch' | 'local'
}

const ResultList = ({ data, isLoading, type }: Props) => {
  return (
    <div className='result'>
      {type === 'fetch' && (
        <>
          {/* Loading */}
          {isLoading === LOADING_STATE.LOADING && (
            <img src={spinner} alt='loading' className='spinner' />
          )}
          {/* Error  */}
          {isLoading === LOADING_STATE.ERROR && (
            <p>
              Error while fetching data.
              <br />
              Please try again later.
            </p>
          )}
          {/* No results  */}
          {isLoading === LOADING_STATE.COMPLETE && data.length === 0 && <p>No results</p>}
          {/* Data */}
          {isLoading === LOADING_STATE.COMPLETE && data.length > 0 && (
            <ul>
              {data.map((item: DataType) => (
                <li key={item.id}>{item.email}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {/* Local Data */}
      {/* {isLoading === LOADING_STATE.COMPLETE && */}
      {type === 'local' && data.length > 0 && (
        <ul>
          {data.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ResultList
