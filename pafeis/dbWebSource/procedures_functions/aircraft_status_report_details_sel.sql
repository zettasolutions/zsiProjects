
-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: February 17, 2017 9:39 PM
-- Description:	Select aircraft based on aircrat type.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks!
-- ===================================================================================================

CREATE PROCEDURE [dbo].[aircraft_status_report_details_sel]
(
    @organization_id  INT = NULL
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)


SET @stmt = 'SELECT * FROM dbo.aircraft_info_v ' 

IF ISNULL(@organization_id,0) <> 0
   SET @stmt = @stmt + 'WHERE squadron_id=' + cast(@organization_id as varchar(20)) + ' OR organization_id=' + cast(@organization_id as varchar(20))

SET @stmt = @stmt + ' ORDER BY aircraft_code, aircraft_name '; 

EXEC(@stmt);	
END


