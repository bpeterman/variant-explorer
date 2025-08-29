import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material'
import {useEffect, useState} from 'react'
import './VariantList.css'

interface Variant {
  accession: string
  alias: string
  alt: string
  assembly: string
  chr: string
  gene: string
  genomic_start: string
  genomic_stop: string
  inferred_classification: string
  last_evaluated: string | null
  last_updated: string | null
  nucleotide_change: string
  other_mappings: string
  protein_change: string
  ref: string
  region: string
  reported_alt: string
  reported_classification: string
  reported_ref: string
  source: string
  submitter_comment: string
  transcripts: string
  url: string
}

interface SearchResponse {
  count: number
  results: Variant[]
}

const searchUrl = 'http://localhost:8000/variants/'
const defaultPage = 1
const rowsPerPage = 15

export default function VariantList() {
  const [data, setData] = useState<SearchResponse | null>(null)
  const [geneSearch, setGeneSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(defaultPage)
  const [loading, setLoading] = useState(false)

  // fetch the variants whenever the pagination or search change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const params = new URLSearchParams()
      params.set('page', currentPage.toString())

      if (geneSearch) {
        params.set('search', geneSearch)
      }

      const res = await fetch(`${searchUrl}?${params.toString()}`)
      const data = await res.json()

      setLoading(false)
      setData(data)
    }

    fetchData()
  }, [currentPage, geneSearch])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchValue = formData.get('geneSearch') as string
    setGeneSearch(searchValue)
    setCurrentPage(defaultPage) // Reset to first page on new search
  }

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage + 1) // MUI uses 0-based indexing, our API uses 1-based
  }

  return (
    <>
      <Box className="gene-search-container">
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <TextField
            name="geneSearch"
            label="Search by gene"
            variant="outlined"
            size="small"
            className="gene-search-input"
            sx={{ width: 240 }}
          />
          <Typography variant="caption" color="text.secondary">
            (hit enter to search)
          </Typography>
        </form>
      </Box>

      <TableContainer component={Paper}>
        {loading && (
          <Box display="flex" justifyContent="center" padding={3}>
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Gene</TableCell>
                  <TableCell>Nucleotide Change</TableCell>
                  <TableCell>Protein Change</TableCell>
                  <TableCell>Alias</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Reported Classification</TableCell>
                  <TableCell>Last Evaluated</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>More Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.results.map((variant, index) => (
                  <TableRow key={`${variant.accession}-${index}`}>
                    <TableCell>{variant.gene}</TableCell>
                    <TableCell>{variant.nucleotide_change}</TableCell>
                    <TableCell>{variant.protein_change}</TableCell>
                    <TableCell>{variant.alias}</TableCell>
                    <TableCell>{variant.region}</TableCell>
                    <TableCell>{variant.reported_classification}</TableCell>
                    <TableCell>{variant.last_evaluated}</TableCell>
                    <TableCell>{variant.last_updated}</TableCell>
                    <TableCell>
                      <Link
                        href={variant.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        {variant.source}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[rowsPerPage]}
              component="div"
              count={data?.count || 0}
              rowsPerPage={rowsPerPage}
              page={currentPage - 1} // MUI uses 0-based indexing
              onPageChange={handlePageChange}
            />
          </>
        )}
      </TableContainer>
    </>
  )
}