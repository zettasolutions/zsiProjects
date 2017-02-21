
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 5:24 PM
-- Description:	Aircraft type select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[aircraft_type_sel]
(
    @aircraft_type_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @aircraft_type_id IS NOT NULL  
	 SELECT * FROM dbo.aircraft_type WHERE aircraft_type_id = @aircraft_type_id; 
  ELSE
     SELECT * FROM dbo.aircraft_type
	 ORDER BY aircraft_type; 
	
END


