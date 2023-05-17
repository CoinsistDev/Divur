import { Grid, Placeholder, Table } from 'semantic-ui-react'

export default function TablePlaceholder() {
  return (
    <Grid>
    <Grid.Column computer={4}></Grid.Column>
    <Grid.Column computer={10}>
        <Table celled style={{ direction: 'rtl' }}>
            <Table.Header>
                <Table.Row textAlign='right'>
                    <Table.HeaderCell>-----------</Table.HeaderCell>
                    <Table.HeaderCell>----------</Table.HeaderCell>
                    <Table.HeaderCell>-----------</Table.HeaderCell>
                    <Table.HeaderCell>---------</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row textAlign='right'>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                </Table.Row>
                <Table.Row textAlign='right'>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                </Table.Row>
                <Table.Row textAlign='right'>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                    <Table.Cell><Placeholder><Placeholder.Line></Placeholder.Line></Placeholder></Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    </Grid.Column>
</Grid>  )
}
