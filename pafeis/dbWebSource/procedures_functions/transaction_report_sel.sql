

-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: February 25, 2017 2:09 AM
-- Description:	Transaction report will count all the transactions per type.
-- =============================================
CREATE PROCEDURE [dbo].[transaction_report_sel]
AS
BEGIN

SET NOCOUNT ON

	SELECT 'WAREHOUSE RECEIVING' AS transactions, COUNT(*) AS countTransactions FROM [dbo].[receiving]
	UNION
	SELECT 'ISSUANCE DIRECTIVE' AS transactions, COUNT(*) AS countTransactions FROM [dbo].[issuance_directive]
	UNION
	SELECT 'WAREHOUSE ISSUANCE' AS transactions, COUNT(*) AS countTransactions FROM [dbo].[issuances]
	UNION
	SELECT 'PROCUREMENT' AS transactions, COUNT(*) AS countTransactions FROM [dbo].[procurement]
	UNION
	SELECT 'FLIGHT OPERATION' AS transactions, COUNT(*) AS countTransactions FROM [dbo].[flight_operation]

	
END


