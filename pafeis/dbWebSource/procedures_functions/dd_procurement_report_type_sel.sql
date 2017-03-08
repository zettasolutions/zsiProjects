
-- ================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: March 1, 2017 8:47 PM
-- Description:	Dropdownlist options in procurement report type.
-- ================================================================
CREATE PROCEDURE [dbo].[dd_procurement_report_type_sel]
AS
BEGIN

SET NOCOUNT ON

	SELECT 1 AS report_type_id,'Summary' AS report_type
	UNION
	SELECT 2 AS report_type_id,'Delivered On-time' AS report_type
	UNION
	SELECT 3 AS report_type_id,'Delivered Late' AS report_type
	UNION
	SELECT 4 AS report_type_id,'Waiting for Delivery (On-time)' AS report_type
	UNION
	SELECT 5 AS report_type_id,'Waiting for Delivery (Late)' AS report_type

END

