import React, { useEffect, useState } from 'react'
import { Button, Divider, Grid, Header, Icon, Input, Table } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { store } from '../../app/stores/store'
import TablePlaceholder from '../timedDistributions/TablePlaceholder'
import { Box } from '@mui/material'

export default observer(function BlacklistTable() {

    const { blacklistStore } = store
    const { loadBlacklist, removeBlacklistPhone, loading, blacklist, clearBlacklist
        , selectedNumber, clearSelectedPhone, findByPhone } = blacklistStore

    const [target, setTarget] = useState(0);
    const [search, setSearch] = useState('');
    const handleRemoveItem = async (id: number) => {
        setTarget(id);
        await removeBlacklistPhone(id);
    }
    const handleSearch = async () => {
        await findByPhone(search)
    }

    const sendReport = async () => {
          await blacklistStore.sendreport()
    }

    useEffect(() => {
        loadBlacklist();

        return () => clearBlacklist();
    }, [loadBlacklist, clearBlacklist])
    if (loading && blacklist.length === 0) {
        return (
            <TablePlaceholder />
        )
    }
    return (
        <Grid>

            <Grid.Column computer={4}></Grid.Column>
            <Grid.Column computer={11}>
                <Header textAlign='right' as='h2' style={{ paddingBottom: '20px', direction: 'rtl', marginTop: '40px' }}>
                    <Icon name='remove user' style={{ paddingLeft: '20px' }} />
                    <Header.Content>
                        לקוחות שהוסרו מדיוור
                        <Header.Subheader>בדקו מי הלקוחות שהסירו את עצמם מדיוור</Header.Subheader>

                    </Header.Content>
                    <Divider />

                </Header>
                <Box width="100%" display='flex' justifyContent="flex-end">
                    {selectedNumber && (
                        <Button content="נקה"
                            onClick={() => clearSelectedPhone()} />
                    )}
                    <Button icon='search' primary
                        disabled={!search.startsWith("972") || (search.length !== 12 && search.length !== 11)}
                        loading={loading}
                        onClick={() => handleSearch()} />


                    <Input
                        icon='phone'
                        placeholder='חיפוש מספר'
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />

                </Box>


                <Table celled style={{ direction: 'rtl' }}>
                    <Table.Header>
                        <Table.Row textAlign='right'>
                            <Table.HeaderCell>מספר טלפון</Table.HeaderCell>
                            <Table.HeaderCell>פעולות</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>

                        {!selectedNumber ? (blacklist.map(item => (
                            <Table.Row textAlign='right' key={item.id}>
                                <Table.Cell>{item.phone}</Table.Cell>

                                <Table.Cell>
                                    <Button basic color='red'
                                        loading={loading && target === item.id}
                                        onClick={(e) => handleRemoveItem(item.id)}>החזרה לדיוור</Button>

                                </Table.Cell>

                            </Table.Row>
                        ))) : (
                            <Table.Row textAlign='right'>
                                <Table.Cell>{selectedNumber!.phone}</Table.Cell>

                                <Table.Cell>
                                    <Button basic color='red'
                                        loading={loading}
                                        onClick={(e) => handleRemoveItem(selectedNumber!.id)}>החזרה לדיוור</Button>

                                </Table.Cell>

                            </Table.Row>
                        )}
                    </Table.Body>

                </Table>
                {!selectedNumber && (
                    <Button content="טען עוד"
                        onClick={loadBlacklist}
                        loading={loading}
                        disabled={blacklist.length < 30 || (blacklist.length > 30 && blacklist.length % 30 !== 0)} />
                )}
                    <Button content="ייצוא לאקסל"
                        onClick={sendReport}
                        loading={loading}
                       />
            </Grid.Column>
        </Grid>

    )
})
