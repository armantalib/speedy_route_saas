/* eslint-disable no-unused-vars */
import { Fragment, useState, forwardRef } from 'react'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import {
    Card,
    Input,
} from 'reactstrap'
import { arrowleft2, arrowright2, filter, searchnormal } from '../icons/icon'

const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const ProductTableFetch = ({ data, columns, totalPage, rowHeading, showRow, currentPageSend, currentPage, showFilter,notPagination }) => {
    const [modal, setModal] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const perPage = 10

    const handleModal = () => setModal(!modal)

    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = data.filter(item => {
                const startsWith =
                    item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.post.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.email.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.age.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.start_date.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.full_name.toLowerCase().includes(value.toLowerCase()) ||
                    item.post.toLowerCase().includes(value.toLowerCase()) ||
                    item.email.toLowerCase().includes(value.toLowerCase()) ||
                    item.age.toLowerCase().includes(value.toLowerCase()) ||
                    item.salary.toLowerCase().includes(value.toLowerCase()) ||
                    item.start_date.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchValue(value)
        }
    }

    const handlePagination = page => {
        currentPageSend(page.selected + 1)
    }

    const Previous = () => (
        <Fragment>
            <span><img src={arrowleft2} alt="" /></span>
        </Fragment>
    )

    const Next = () => (
        <Fragment>
            <span><img src={arrowright2} alt="" /></span>
        </Fragment>
    )

    const CustomPagination = () => (
        <ReactPaginate
            previousLabel={<Previous size={15} />}
            nextLabel={<Next size={15} />}
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={totalPage}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            nextLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextClassName='page-item next-item'
            previousClassName='page-item prev-item'
            containerClassName='pagination react-paginate separated-pagination pagination-sm gap-2 ps-3 mt-4'
        />
    )

    return (
        <>
            <Fragment>
                <Card className='border border-[#E8E8E9] rounded-xl shadow-sm w-full'>
                    {showRow && (
                        <div className='flex items-center justify-between flex-wrap p-3 max-md:gap-3 w-full border-b border-[#F0F0F0]'>
                            <div className="">
                                <h6 className='font-semibold text-[#6C7278]'>{rowHeading}</h6>
                            </div>
                            <div className='flex items-center flex-wrap gap-[12px]'>
                                <div className='relative'>
                                    <img src={searchnormal} className='absolute top-3 left-3' alt="" />
                                    <Input
                                        className='ps-10 py-[8px] w-full rounded-md border border-[#E8E8E9]'
                                        type='text'
                                        placeholder='Search anything here'
                                        id='search-input-1'
                                        value={searchValue}
                                        onChange={handleFilter}
                                    />
                                </div>
                                {showFilter && (
                                    <div>
                                        <button className="flex items-center gap-2 border rounded-md py-[8px] px-[14px] bg-white hover:bg-gray-50">
                                            <img src={filter} alt="" />
                                            <span className='font-medium text-black text-sm'>Filter</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            pagination={notPagination?false:true}
                            selectableRowsNoSelectAll
                            columns={columns}
                            paginationPerPage={30}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={14} />}
                            paginationDefaultPage={currentPage + 1}
                            paginationComponent={CustomPagination}
                            data={searchValue.length ? filteredData : data}
                            selectableRowsComponent={BootstrapCheckbox}
                            customStyles={customStyles}
                        />
                    </div>
                </Card>
            </Fragment>
        </>
    )
}

export default ProductTableFetch;

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#F9FAFB",   // header bg
      color: "#6B7280",             // header text
      fontWeight: "600",
      fontSize: "14px",
      borderBottom: "1px solid #E5E7EB",
      paddingTop: "12px",
      paddingBottom: "12px"
    },
  },
  rows: {
    style: {
      borderBottom: "1px solid #F3F4F6", // row divider
      fontSize: "14px",
      color: "#374151"
    }
  },
  cells: {
    style: {
      paddingTop: "14px",
      paddingBottom: "14px"
    }
  }
}
