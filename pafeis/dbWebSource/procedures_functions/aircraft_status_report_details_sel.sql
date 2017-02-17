
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
    @aircraft_type_id  INT = 1
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)


SET @stmt = 'SELECT b.organization_code, a.aircraft_code, a.aircraft_name ' +  
			'FROM dbo.aircraft_info_v as a ' +
			'INNER JOIN dbo.organizations as b ' +
			'ON a.squadron_id = b.organization_id '

IF ISNULL(@aircraft_type_id,0) <> 0
   SET @stmt = @stmt + 'WHERE a.aircraft_type_id = ' + cast(@aircraft_type_id as varchar(20)) 

SET @stmt = @stmt + ' ORDER BY a.aircraft_code, a.aircraft_name'; 

EXEC(@stmt);	
END


