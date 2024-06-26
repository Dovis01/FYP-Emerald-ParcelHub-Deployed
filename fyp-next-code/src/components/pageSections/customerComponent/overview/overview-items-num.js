import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Stack,
    SvgIcon,
    Typography
} from '@mui/material';
import {useTheme} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {getAllCustomerPersonalOrdersData} from "@/api/springboot-api";
import {Chart} from "@/components/customized/chart";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";

function countTotalItems(data) {
    return data.reduce((total, order) => {
        const itemsCount = order.parcel.items.length;
        return total + itemsCount;
    }, 0);
}

export const OverviewItemsNum = (props) => {
    const theme = useTheme();
    const {difference, positive = false, sx, loadCacheData} = props;
    const [value, setValue] = useState(null);
    const seriesData = loadCacheData.OverviewItemsNum || [];

    useEffect(() => {
        const fetchJsonData = async () => {
            const result = await getAllCustomerPersonalOrdersData(props.userInfo.customerId);
            if (result.data) {
                setValue(() => countTotalItems(result.data));
            }
        };

        fetchJsonData();
    }, [props.userInfo.customerId]);

    const options = {
        series: [{
            name: 'Total No. of Items in Parcels',
            data: seriesData
        }],
        colors: [theme.palette.warning.main],
        chart: {
            type: 'area',
            height: 160,
            sparkline: {
                enabled: true
            },
        },
        stroke: {
            curve: 'straight'
        },
        fill: {
            opacity: 0.3
        },
        xaxis: {
            crosshairs: {
                width: 1
            },
        },
        yaxis: {
            show: false,
            min: 0,
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            },
            y: {
                formatter: function (val) {
                    return `${val}`;
                }
            },
        },
    };

    return (
        <Card sx={sx}>
            <Box>
                <CardContent>
                    <Stack
                        alignItems="flex-start"
                        direction="row"
                        justifyContent="space-between"
                        spacing={3}
                    >
                        <Stack spacing={1}>
                            <Typography
                                sx={{fontSize: '1.08rem', fontWeight: '720'}}
                            >
                                Total No. of Items in Parcels
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <Typography variant="h4" sx={{mr: 2}}>
                                    {value}
                                </Typography>
                                {difference && (
                                    <>
                                        <SvgIcon
                                            color={positive ? 'success' : 'error'}
                                            fontSize="small"
                                        >
                                            {positive ? <ArrowUpIcon/> : <ArrowDownIcon/>}
                                        </SvgIcon>
                                        <Typography
                                            color={positive ? 'success.main' : 'error.main'}
                                            variant="body2"
                                        >
                                            {difference}%
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="caption"
                                        >
                                            Since last month
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Stack>
                        <Avatar
                            sx={{
                                backgroundColor: 'warning.main',
                                height: 56,
                                width: 56
                            }}
                        >
                            <SvgIcon>
                                <ListBulletIcon/>
                            </SvgIcon>
                        </Avatar>
                    </Stack>
                </CardContent>
                <Chart
                    options={options}
                    series={options.series}
                    type="area"
                    height={160}
                />
            </Box>
        </Card>
    );
};

