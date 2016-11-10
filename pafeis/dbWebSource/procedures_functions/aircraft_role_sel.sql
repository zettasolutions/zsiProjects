
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 5:15 PM
-- Description:	Aircraft role select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[aircraft_role_sel]
(
    @aircraft_role_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @aircraft_role_id IS NOT NULL  
	 SELECT * FROM dbo.aircraft_role WHERE aircraft_role_id = @aircraft_role_id; 
  ELSE
     SELECT * FROM dbo.aircraft_role
	 ORDER BY aircraft_role; 
	
END

