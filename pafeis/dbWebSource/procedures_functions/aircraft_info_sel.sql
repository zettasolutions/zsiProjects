

-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 6:20 PM
-- Description:	Aircraft info select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[aircraft_info_sel]
(
    @aircraft_info_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @aircraft_info_id IS NOT NULL  
	 SELECT * FROM dbo.aircraft_info WHERE aircraft_info_id = @aircraft_info_id; 
  ELSE
     SELECT * FROM dbo.aircraft_info
	 ORDER BY aircraft_name; 
	
END


